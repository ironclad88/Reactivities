import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile, ProfileFormValues } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";
import { UserActivity } from "../models/userActivity";
import { Pagination, PagingParams } from "../models/pagination";
import { UserActivityFilter } from "../models/userActivityFilter";

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;
  loadingFollowings = false;
  followings: Profile[] = [];
  activeTab = 0;
  loadingActivitiesInitial = false;
  loadingActivities = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  activityRegistry: UserActivity[] = [];
  activityFilter = new UserActivityFilter();

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "followings";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
    reaction(
      () => this.activityFilter.predicate,
      () => this.handleNewPredicate()
    );
    reaction(
      () => this.activityFilter.username,
      () => this.handleNewPredicate()
    );
  }

  handleNewPredicate = () => {
    this.activityRegistry = [];
    this.pagingParams = new PagingParams(1,this.pagingParams.pageSize);
    this.loadActivities();
    // console.log("in act filter reaction");
  }

  setActivityFilter = (filter: UserActivityFilter) => {
    this.activityFilter = filter;
  };

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());
    return params;
  }

  setActiveTab = (activeTab: number) => (this.activeTab = activeTab);

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }
    return false;
  }

  loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => (this.loadingProfile = false));
    }
  };

  clearActivities = () => {
    this.activityRegistry = [];
  }

  loadActivities = async () => {
    if(this.activityFilter.username === "") return;
    if (this.activityRegistry.length === 0) {
      this.loadingActivitiesInitial = true;
    } else {
      this.loadingActivities = true;
    }
    // console.log("in loadActivities, params: " + this.axiosParams + ", username: " + this.activityFilter.username + ", predicate: " + this.activityFilter.predicate);
    try {
      const result = await agent.Profiles.listActivities(
        this.axiosParams,
        this.activityFilter.username,
        this.activityFilter.predicate
      );
      runInAction(() => {
        result.data.forEach((activity) => {
          this.activityRegistry.push({
            ...activity,
            ...{ date: new Date(activity.date!) },
          });
          // console.log(
          //   "profileStore.loadActivities: added activity id " +
          //     activity.id +
          //     " to activityRegistry(size: " +
          //     this.activityRegistry.length +
          //     ")"
          // );
        });
        this.pagination = result.pagination;
        this.loadingActivities = false;
        this.loadingActivitiesInitial = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingActivities = false;
        this.loadingActivitiesInitial = false;
      });
    }
  };

  setLoadingActivities = (value: boolean) => (this.loadingActivities = value);

  updateProfile = async (profile: ProfileFormValues) => {
    this.loading = true;
    try {
      await agent.Profiles.update(profile as Profile);
      runInAction(() => {
        if (this.profile) {
          this.profile.bio = profile.bio;
          this.profile.displayName = profile.displayName;
          store.userStore.setDisplayName(profile.displayName);
        }
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => (this.loading = false));
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      const response = await agent.Profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
        this.uploading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => (this.uploading = false));
    }
  };

  setMainPhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find((p) => p.isMain)!.isMain = false;
          this.profile.photos.find((p) => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => (this.loading = false));
      console.log(error);
    }
  };

  deletePhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos = this.profile.photos.filter((p) => p.id !== photo.id);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => (this.loading = false));
      console.log(error);
    }
  };

  updateFollowing = async (username: string, following: boolean) => {
    if (username === store.userStore.user!.username) {
      console.log("Cannot un/follow self");
      return;
    }
    this.loading = true;
    try {
      await agent.Profiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
      runInAction(() => {
        if (this.profile) {
          if (this.profile.username === username) {
            // Follow toggle for currently viewed profile (cannot be the user)
            following ? this.profile.followersCount++ : this.profile.followersCount--;
            this.profile.following = !this.profile?.following;
          } else if (this.isCurrentUser) {
            // Viewing current user's profile
            following ? this.profile.followingCount++ : this.profile.followingCount--;
          }
        }
        this.followings.forEach((profile) => {
          // Looping though all currently stored followings
          if (profile.username === username) {
            profile.following ? profile.followersCount-- : profile.followersCount++;
            profile.following = !profile.following;
          }
        });
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => (this.loading = false));
      console.log(error);
    }
  };

  loadFollowings = async (predicate: string) => {
    this.loadingFollowings = true;
    try {
      const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
      runInAction(() => {
        this.followings = followings;
        this.loadingFollowings = false;
      });
    } catch (error) {
      runInAction(() => (this.loadingFollowings = false));
      console.log(error);
    }
  };
}
